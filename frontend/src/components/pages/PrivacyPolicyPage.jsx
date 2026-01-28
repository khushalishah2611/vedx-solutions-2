import { useEffect, useMemo, useState } from 'react';
import { Box, Container, Stack, Tab, Tabs, Typography, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { apiUrl } from '../../utils/const.js';
import { useBannerByType } from '../../hooks/useBannerByType.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const tabs = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms and Condition', path: '/terms-and-condition' },
];

const PrivacyPolicyPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { fetchWithLoading } = useLoadingFetch();
  const { banner } = useBannerByType('privacy-policy');
  const [policy, setPolicy] = useState(null);
  const [error, setError] = useState('');

  const activeTab = useMemo(() => tabs[0].path, []);

  useEffect(() => {
    let isMounted = true;

    const loadPolicy = async () => {
      setError('');
      try {
        const response = await fetchWithLoading(apiUrl('/api/privacy-policy'));
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || 'Unable to load privacy policy right now.');
        if (!isMounted) return;
        setPolicy(payload?.policy || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'Unable to load privacy policy right now.');
        setPolicy(null);
      }
    };

    loadPolicy();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const heroImage = banner?.image || '';
  const heroTitle = banner?.title || 'Privacy Policy';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          color: '#fff',
          backgroundImage: heroImage
            ? `linear-gradient(180deg, ${alpha('#000', 0.7)} 0%, ${alpha('#000', 0.75)} 100%), url(${heroImage})`
            : `linear-gradient(180deg, ${alpha('#000', 0.75)} 0%, ${alpha('#000', 0.85)} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 20 } }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {heroTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#fff', 0.85), maxWidth: 720 }}>
              Review how VedX Solutions handles your data and protects your privacy.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, value) => navigate(value)}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4 }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} value={tab.path} label={tab.label} />
          ))}
        </Tabs>

        {error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
              borderRadius: 2,
              p: { xs: 3, md: 5 },
              boxShadow: `0 24px 48px ${alpha('#000', 0.12)}`,
            }}
          >
            {policy?.description ? (
              <Box
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                  '& h1, & h2, & h3, & h4': { marginTop: 3, marginBottom: 1 },
                  '& p': { marginBottom: 2 },
                  '& ul': { paddingLeft: 3, marginBottom: 2 },
                }}
                dangerouslySetInnerHTML={{ __html: policy.description }}
              />
            ) : (
              <Typography color="text.secondary" align="center">
                Privacy policy content will appear here once it is published.
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
