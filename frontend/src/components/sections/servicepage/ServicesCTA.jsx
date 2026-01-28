import { Box, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../shared/FormControls.jsx';
import { apiUrl } from '../../../utils/const.js';


const ServicesCTA = ({
  onContactClick,
  category,
  subcategory,
  apiPath = '/api/contact-buttons',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [ctaConfig, setCtaConfig] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCtaConfig = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        const requestPath = params.toString()
          ? `${apiPath}?${params.toString()}`
          : apiPath;
        const response = await fetch(apiUrl(requestPath));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load contact CTA');
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        if (params.toString()) {
          setCtaConfig(list[0] || null);
        } else {
          const matched = list.find(
            (item) =>
              (category && item.category === category && (!subcategory || item.subcategory === subcategory)) ||
              (!category && !subcategory)
          );
          setCtaConfig(matched || list[0] || null);
        }
      } catch (error) {
        console.error('Failed to load contact CTA', error);
      }
    };

    loadCtaConfig();

    return () => {
      isMounted = false;
    };
  }, [apiPath, category, subcategory]);

  const backgroundImage = useMemo(() => ctaConfig?.image, [ctaConfig]);
  const handleContactClick = () => {
    onContactClick?.();
    navigate('/contact');
  };

  return (
    <Box component="section" id="contact-section" sx={{ mt: { xs: 6, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0.5,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          backgroundColor: 'transparent',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: `1px solid ${alpha('#ffffff', isDark ? 0.1 : 0.35)}`,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          {/* Text block */}
          <Stack
            spacing={1.5}
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              maxWidth: { xs: '100%', md: '70%' },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 22, md: 26 },
              }}
            >
              {ctaConfig?.title || "Let's Build Your Next Big Product, Together."}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: alpha(theme.palette.text.primary, 0.78),
                maxWidth: 620,
              }}
            >
              {ctaConfig?.description ||
                `Let Vedx Solution be your tech growth partner for full stack app
              development tailored to your needs.`}
            </Typography>
          </Stack>

          {/* Button block */}
          <Box
            sx={{
              mt: { xs: 1, md: 0 },
              width: { xs: '100%', md: 'auto' },
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            <AppButton
              variant="contained"
              size="large"
              onClick={handleContactClick}
              sx={{
                background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                color: '#fff',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 1.75 },
                width: { xs: 'auto', md: 'auto' },
               
              }}
            >
              Contact Us
            </AppButton>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ServicesCTA;
