
import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { AppButton } from '../../shared/FormControls.jsx';

import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';

import { whyChooseVedx } from '../../../data/servicesPage.js';
import { apiUrl } from '../../../utils/const.js';
import { useLoadingFetch } from '../../../hooks/useLoadingFetch.js';

const highlightIcons = [
  WorkspacePremiumRoundedIcon,
  VerifiedRoundedIcon,
  AutoAwesomeRoundedIcon,
];

const ServicesWhyChoose = ({
  onContactClick,
  onRequestContact,
  contactAnchorId = 'contact-section',
  title,
  description,
  highlights: highlightsProp,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const { fetchWithLoading } = useLoadingFetch();

  const [apiConfig, setApiConfig] = useState(null);
  const [apiHighlights, setApiHighlights] = useState([]);

  const handleRequestQuote = () => {
    onRequestContact?.('');
    onContactClick?.();

    const anchor = document.getElementById(contactAnchorId);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (highlightsProp && title && description) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const configRes = await fetchWithLoading(
          apiUrl('/api/homes/why-vedx-config')
        );
        const configData = await configRes.json();

        if (!configRes.ok) {
          throw new Error(configData?.error || 'Failed to load config');
        }

        const config = Array.isArray(configData)
          ? configData[0]
          : configData;

        if (isMounted) {
          setApiConfig(config || null);
        }

        const reasonsQuery = config?.id
          ? `?whyVedxId=${config.id}`
          : '';

        const reasonsRes = await fetchWithLoading(
          apiUrl(`/api/homes/why-vedx-reasons${reasonsQuery}`)
        );
        const reasonsData = await reasonsRes.json();

        if (!reasonsRes.ok) {
          throw new Error(reasonsData?.error || 'Failed to load reasons');
        }

        if (!isMounted) return;

        const reasons = Array.isArray(reasonsData)
          ? reasonsData
          : reasonsData?.reasons;

        setApiHighlights(
          (reasons || []).map((item) => ({
            title: item?.title || '',
            description: item?.description || '',
            image: item?.image || '',
          }))
        );
      } catch (err) {
        console.error('Why Vedx load error:', err);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [description, fetchWithLoading, highlightsProp, title]);

  const highlights = useMemo(() => {
    const resolved =
      highlightsProp ||
      (apiHighlights.length ? apiHighlights : whyChooseVedx);

    return resolved.filter((item) => item?.title);
  }, [apiHighlights, highlightsProp]);

  return (
    <Box component="section">
      {/* Header */}
      <Stack spacing={3} sx={{ mb: 4, textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          {title || apiConfig?.title}
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          {description || apiConfig?.description}
        </Typography>
      </Stack>

      {/* Cards */}
      <Grid container spacing={3} alignItems="stretch">
        {highlights.map((highlight, index) => {
          const Icon =
            highlight.icon ||
            highlightIcons[index % highlightIcons.length];

          return (
            <Grid item xs={12} sm={6} md={4} key={highlight.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 0.5,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.75 : 0.97
                  ),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.4 : 0.6
                  )}`,
                  boxShadow: isDark
                    ? '0 4px 30px rgba(2,6,23,0.35)'
                    : '0 4px 30px rgba(15,23,42,0.15)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: alpha(accentColor, 0.9),
                  },
                }}
              >
                {/* Icon / Image */}
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {highlight.image ? (
                    <Box
                      component="img"
                      src={highlight.image}
                      alt={highlight.title}
                      sx={{ width: 70, height: 70, objectFit: 'contain' }}
                    />
                  ) : (
                    Icon && (
                      <Icon
                        sx={{ fontSize: 40, color: accentColor }}
                      />
                    )
                  )}
                </Box>

                {/* Text */}
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'transparent',
                        backgroundImage:
                          'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      },
                    }}
                  >
                    {highlight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {highlight.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* CTA */}
      <Stack alignItems="center" sx={{ mt: 6 }}>
        <AppButton
          variant="contained"
          size="large"
          endIcon={<ArrowOutwardRoundedIcon />}
          onClick={handleRequestQuote}
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
              background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
            },
          }}
        >
          Request a Quote
        </AppButton>
      </Stack>
    </Box>
  );
};

export default ServicesWhyChoose;
