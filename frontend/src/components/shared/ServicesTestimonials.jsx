import { useEffect, useMemo, useState } from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';

import { apiUrl } from '../../utils/const.js';
import { useLoadingFetch } from '../../hooks/useLoadingFetch.js';

const ServicesTestimonials = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { fetchWithLoading } = useLoadingFetch();

  const [apiFeedbacks, setApiFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Fetch testimonials
  useEffect(() => {
    let isMounted = true;

    const loadFeedbacks = async () => {
      try {
        const response = await fetchWithLoading(apiUrl('/api/feedbacks'));
        if (!response.ok) throw new Error('Failed to fetch feedbacks');

        const payload = await response.json();
        if (!isMounted) return;

        const mapped = (payload.feedbacks ?? []).map((f) => ({
          quote: f.description || '',
          name: f.name || '',
          rating: f.rating ?? 5,
        }));

        setApiFeedbacks(mapped);
      } catch (error) {
        console.error('Failed to load feedbacks', error);
      }
    };

    loadFeedbacks();
    return () => { isMounted = false; };
  }, [fetchWithLoading]);

  const testimonials = useMemo(() => {
    return apiFeedbacks.filter(t => t.quote && t.name);
  }, [apiFeedbacks]);

  const slidesCount = isMobile
    ? testimonials.length
    : Math.ceil(testimonials.length / 2);

  // 🔹 Auto slide
  useEffect(() => {
    if (slidesCount === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === slidesCount - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [slidesCount]);

  if (testimonials.length === 0) return null;

  const startIndex = isMobile
    ? currentIndex % testimonials.length
    : (currentIndex * 2) % testimonials.length;

  const visibleTestimonials = isMobile
    ? [testimonials[startIndex]]
    : [
        testimonials[startIndex],
        testimonials[(startIndex + 1) % testimonials.length]
      ];

  return (
    <Box component="section" textAlign="center">
      {/* Header */}
      <Stack spacing={2} sx={{ mb: 6, alignItems: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          What People Are Saying.
        </Typography>
        <Typography sx={{ color: subtleText,  }}>
          Discover why clients trust us for quality and results.
        </Typography>
      </Stack>

      {/* Testimonials */}
      <Grid container spacing={2} justifyContent="center">
        {visibleTestimonials.map((testimonial, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                textAlign: 'left',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.97
                ),
                border: `1px solid ${alpha(theme.palette.divider, 0.4)}`
              }}
            >
              <Typography sx={{ fontStyle: 'italic', color: subtleText }}>
                “{testimonial.quote}”
              </Typography>

              <Typography sx={{ mt: 2, fontWeight: 700 }}>
                {testimonial.name}
              </Typography>

              <Stack direction="row" spacing={0.5} mt={1}>
                {[...Array(5)].map((_, index) => (
                  <StarRoundedIcon
                    key={index}
                    sx={{
                      fontSize: 18,
                      color:
                        index < testimonial.rating
                          ? accentColor
                          : alpha(subtleText, 0.4)
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Indicator Dots */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={1}
        sx={{ mt: 4 }}
      >
        {[...Array(slidesCount)].map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor:
                index === currentIndex
                  ? accentColor
                  : alpha(subtleText, 0.4),
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.3)',
                backgroundColor: alpha(accentColor, 0.7),
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ServicesTestimonials;
