import { useEffect, useMemo, useState } from 'react';
import { Box, Container, Grid, List, ListItem, Stack, Typography, alpha, useTheme } from '@mui/material';
import { AppButton } from './FormControls.jsx';

import { pricingPlans } from '../../data/pricing.js';
import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const PricingModels = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();
  const [apiPlans, setApiPlans] = useState([]);
  const [heroContent, setHeroContent] = useState({
    title: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadPricing = async () => {
      try {
        const response = await fetchWithLoading(apiUrl('/api/hire-developer/pricing'));
        if (!response.ok) {
          throw new Error('Failed to fetch hire developer pricing');
        }
        const data = await response.json();
        if (!isMounted) return;

        const popularIndex = data.length ? Math.min(1, data.length - 1) : -1;
        const mapped = (data || []).map((plan, index) => ({
          id: plan.id,
          title: plan.title || '',
          cadence: plan.subtitle || '',
          emphasis: plan.description || '',
          price: plan.price || '',
          features: Array.isArray(plan.services) ? plan.services : [],
          isPopular: index === popularIndex,
          heroTitle: plan.heroTitle || '',
          heroDescription: plan.heroDescription || '',
          heroImage: plan.heroImage || '',
        }));

        setApiPlans(mapped);

        const heroSource = mapped[0];
        if (heroSource) {
          setHeroContent({
            title: heroSource.heroTitle || '',
            description: heroSource.heroDescription || '',
            image: heroSource.heroImage || '',
          });
        }
      } catch (error) {
        console.error('Failed to load hire pricing', error);
      }
    };

    loadPricing();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const resolvedPlans = useMemo(
    () => (apiPlans.length ? apiPlans : pricingPlans),
    [apiPlans]
  );
  const highlightedIndex = useMemo(() => {
    const popularIndex = resolvedPlans.findIndex((plan) => plan.isPopular);
    if (popularIndex >= 0) return popularIndex;
    return resolvedPlans.length ? Math.min(1, resolvedPlans.length - 1) : -1;
  }, [resolvedPlans]);
  const resolvedHeroTitle = heroContent.title || 'Our Pricing Models';
  const resolvedHeroDescription =
    heroContent.description ||
    'Choose the contract structure that aligns with your roadmap. Each plan includes vetted VedX talent, collaborative delivery, and proactive communication tailored to your operating hours.';

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',

        color: 'common.white',
        overflow: 'hidden',

      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 6 }}>


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
                background:
                  'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Transparent Engagements
            </Box>
          </Box>


          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 800,
            }}
          >
            {resolvedHeroTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              color: alpha('#ffffff', 0.78),
              lineHeight: 1.7,
            }}
          >
            {resolvedHeroDescription}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 4, md: 5 }}>
          {resolvedPlans.map((plan, index) => {
            const isHighlighted = index === highlightedIndex;
            return (
              <Grid item xs={12} md={4} key={plan.title}>
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    borderRadius: 0.5,
                    px: { xs: 4, md: 5 },
                    py: { xs: 5, md: 6 },
                    backgroundColor: isHighlighted
                      ? alpha('#0f172a', 0.92)
                      : alpha('#0f172a', 0.7),
                    boxShadow: isHighlighted
                      ? '0 24px 60px rgba(15,23,42,0.55)'
                      : '0 16px 45px rgba(15,23,42,0.38)',
                    border: `1px solid ${alpha(isHighlighted ? accentColor : '#334155', isHighlighted ? 0.6 : 0.35)}`,
                    transform: isHighlighted ? 'translateY(-12px)' : 'translateY(0)',
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.01)',
                      boxShadow: '0 30px 65px rgba(15,23,42,0.6)',
                    },
                  }}
                >
                  {isHighlighted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        right: 32,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 0.5,
                        background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      Most Popular
                    </Box>
                  )}

                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: 1.2,
                          color: alpha('#ffffff', 0.75),
                          fontWeight: 600,
                        }}
                      >
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: 36, md: 40 },
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha('#ffffff', 0.75), fontWeight: 500 }}
                      >
                        {plan.cadence}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                      {plan.emphasis}
                    </Typography>

                    <List disablePadding sx={{ display: 'grid', gap: 1 }}>
                      {plan.features.map((feature) => (
                        <ListItem
                          key={feature}
                          disableGutters
                          sx={{
                            display: 'flex',
                            p: 0,
                            gap: 1.5,
                            alignItems: 'flex-start',
                            color: alpha('#ffffff', 0.85),
                            fontSize: 14,
                          }}
                        >
             
                          {feature}
                        </ListItem>
                      ))}
                    </List>

                    <AppButton
                      variant={isHighlighted ? 'contained' : 'outlined'}
                      color="inherit"
                      sx={{
                        mt: 2,
                        borderRadius: 0.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: alpha('#ffffff', isHighlighted ? 0 : 0.6),
                        color: '#fff',
                        background: isHighlighted
                          ? 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)'
                          : 'transparent',
                        '&:hover': {
                          borderColor: alpha('#ffffff', 0.85),
                          background: isHighlighted
                            ? 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                            : alpha('#ffffff', 0.12),
                        },
                      }}
                    >
                      Book Talent
                    </AppButton>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>


      </Container>
    </Box>
  );
};

export default PricingModels;
