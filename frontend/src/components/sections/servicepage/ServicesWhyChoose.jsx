import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { AppButton } from '../../shared/FormControls.jsx';

import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';

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

  // optional overrides
  title: titleProp,
  description: descriptionProp,
  highlights: highlightsProp,

  // 'home' | 'service' | 'hire'
  mode = 'home',
  category,
  subcategory,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const { fetchWithLoading } = useLoadingFetch();

  const [apiConfig, setApiConfig] = useState(null); // { title, description }
  const [apiHighlights, setApiHighlights] = useState([]);
  const [loading, setLoading] = useState(false); // fetch control only (NO UI spinner)

  const handleRequestQuote = useCallback(() => {
    onRequestContact?.('');
    onContactClick?.();

    const anchor = document.getElementById(contactAnchorId);
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [onRequestContact, onContactClick, contactAnchorId]);

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      const shouldFetchConfig = !titleProp && !descriptionProp;
      const shouldFetchHighlights = !highlightsProp;

      if (!shouldFetchConfig && !shouldFetchHighlights) return;

      try {
        setLoading(true);

        // ---------------- HOME MODE ----------------
        if (mode === 'home') {
          const tasks = [];

          // config (title/description)
          if (shouldFetchConfig) {
            tasks.push(
              fetchWithLoading(apiUrl('/api/homes/why-vedx-config'))
                .then(async (res) => {
                  if (!res.ok) throw new Error('Failed to fetch why-vedx-config');
                  const payload = await res.json();
                  const cfg = payload?.config ?? payload;

                  return {
                    title: cfg?.title ?? '',
                    description: cfg?.description ?? '',
                  };
                })
                .catch((err) => {
                  console.error('why-vedx-config error:', err);
                  return null;
                })
            );
          } else {
            tasks.push(Promise.resolve(null));
          }

          // highlights (reasons/cards)
          if (shouldFetchHighlights) {
            tasks.push(
              fetchWithLoading(apiUrl('/api/homes/why-vedx-reasons'))
                .then(async (res) => {
                  if (!res.ok) throw new Error('Failed to fetch why-vedx-reasons');
                  const payload = await res.json();
                  const reasons = Array.isArray(payload) ? payload : payload?.reasons;

                  return (reasons || [])
                    .filter((item) => (item?.isActive ?? true) === true)
                    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
                    .map((item) => ({
                      title: item?.title || '',
                      description: item?.description || '',
                      image: item?.image || '',
                      icon: item?.icon,
                    }));
                })
                .catch((err) => {
                  console.error('why-vedx-reasons error:', err);
                  return [];
                })
            );
          } else {
            tasks.push(Promise.resolve([]));
          }

          const [cfg, highs] = await Promise.all(tasks);
          if (!isMounted) return;

          if (cfg) setApiConfig(cfg);
          if (Array.isArray(highs)) setApiHighlights(highs);
          return;
        }

        // ---------------- SERVICE / HIRE MODE ----------------
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        params.append('includeReasons', 'true');
        params.append('public', 'true');

        const requestPath =
          mode === 'hire'
            ? `/api/hire-developer/why-vedx?${params.toString()}`
            : `/api/why-vedx?${params.toString()}`;

        const response = await fetchWithLoading(apiUrl(requestPath));
        if (!response.ok) throw new Error('Failed to fetch why-vedx data');

        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : payload ? [payload] : [];
        const active = list[0] || null;

        if (!isMounted) return;

        if (shouldFetchConfig) {
          setApiConfig({
            title: active?.heroTitle || '',
            description: active?.heroDescription || '',
          });
        }

        if (shouldFetchHighlights) {
          const reasons = active?.reasons || [];
          const sortedReasons = (reasons || [])
            .filter((item) => (item?.isActive ?? true) === true)
            .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

          setApiHighlights(
            sortedReasons.map((item) => ({
              title: item?.title || '',
              description: item?.description || '',
              image: item?.image || '',
              icon: item?.icon,
            }))
          );
        }
      } catch (err) {
        console.error('ServicesWhyChoose load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading, titleProp, descriptionProp, highlightsProp, mode, category, subcategory]);

  // ✅ NO FALLBACK (only props/API else blank)
  const finalTitle = useMemo(() => {
    return (
      (titleProp && String(titleProp).trim()) ||
      (apiConfig?.title && String(apiConfig.title).trim()) ||
      ''
    );
  }, [titleProp, apiConfig]);

  const finalDescription = useMemo(() => {
    return (
      (descriptionProp && String(descriptionProp).trim()) ||
      (apiConfig?.description && String(apiConfig.description).trim()) ||
      ''
    );
  }, [descriptionProp, apiConfig]);

  const highlights = useMemo(() => {
    const resolved = highlightsProp || apiHighlights;
    return (resolved || []).filter((item) => item?.title);
  }, [apiHighlights, highlightsProp]);

  const showGrid = highlights.length > 0;

  return (
    <Box component="section">
      {/* Section Header */}
      <Stack
        spacing={3}
        sx={{
          maxWidth: 520,
          mx: 'auto',
          alignItems: 'center',
        }}
      >
        {/* Label - centered */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            mx: 'auto',
            textAlign: 'center',
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
      </Stack>

      <Stack
        spacing={3}
        sx={{
          mb: showGrid ? 4 : 0,
          textAlign: 'center',
          alignItems: 'center',
          mt: 3,
        }}
      >
        {!!finalTitle && (
          <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
            {finalTitle}
          </Typography>
        )}

        {!!finalDescription && (
          <Typography variant="body1" sx={{ color: subtleText }}>
            {finalDescription}
          </Typography>
        )}
      </Stack>

      {/* Highlights Grid (NO spinner; render only when data exists) */}
      {showGrid && (
        <Grid container spacing={3} sx={{ textAlign: 'center', alignItems: 'stretch' }}>
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon ?? highlightIcons[index % highlightIcons.length];

            return (
              <Grid item xs={12} sm={6} md={4} key={`${highlight.title}-${index}`}>
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
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                    boxShadow: isDark
                      ? '0 4px 30px rgba(2,6,23,0.35)'
                      : '0 4px 30px rgba(15,23,42,0.15)',
                    transition:
                      'transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                    },
                  }}
                >
                  {/* Icon / Image */}
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
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
                      Icon && <Icon />
                    )}
                  </Box>

                  {/* Text */}
                  <Stack spacing={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
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
      )}

      {/* CTA Button (keep visible even if loading / no highlights) */}
      <Stack alignItems="center" sx={{ width: '100%', mt: 6 }}>
        <AppButton
          variant="contained"
          size="large"
          endIcon={<ArrowOutwardRoundedIcon />}
          onClick={handleRequestQuote}
          disabled={loading} // optional: prevent double click while fetching
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
            '&.Mui-disabled': {
              opacity: 0.6,
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
