import { useEffect, useState } from 'react';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { testimonialList } from '../../data/servicesPage.js';

const ServicesTestimonials = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = testimonialList.filter(
    (testimonial) => testimonial?.quote && testimonial?.name
  );

  // Total slides to handle pagination
  const slidesCount = testimonials.length === 0
    ? 0
    : isMobile
      ? testimonials.length
      : Math.ceil(testimonials.length / 2);

  const handlePrev = () => {
    if (slidesCount === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? slidesCount - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slidesCount === 0) return;
    setCurrentIndex((prev) => (prev === slidesCount - 1 ? 0 : prev + 1));
  };

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (slidesCount === 0) return undefined;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isMobile, slidesCount]);

  // Visible testimonials
  if (testimonials.length === 0) {
    return null;
  }

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
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',

      }}
    >
      {/* Header */}
      <Stack spacing={2} sx={{ mb: 6, alignItems: 'center' }}>
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
            width: 'fit-content'
          }}
        >
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Customer Reviews
          </Box>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 30, md: 42 },
            fontWeight: 700
          }}
        >
          What People Are Saying.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 720
          }}
        >
          There are many variations of passages of Lorem Ipsum available, but the
          majority have suffered alteration.
        </Typography>
      </Stack>



      {/* Testimonials */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="stretch"
        sx={{
          px: { xs: 2, md: 8 },
          transition: 'transform 0.5s ease'
        }}
      >
        {visibleTestimonials.map((testimonial, i) => (
          <Grid item xs={12} md={6} key={`${testimonial.name}-${i}`}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 3,
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
              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  fontStyle: 'italic',
                  lineHeight: 1.8
                }}
              >
                “{testimonial.quote}”
              </Typography>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {testimonial.name}
                </Typography>

                {/* ⭐ Rating */}
                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                  {[...Array(5)].map((_, index) => (
                    <StarRoundedIcon
                      key={index}
                      sx={{
                        fontSize: 18,
                        color:
                          index < testimonial.rating
                            ? alpha(accentColor, 0.9)
                            : alpha(subtleText, 0.4)
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>



      {/* Dots Navigation */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={1}
        sx={{ mt: 5 }}
      >
        {[...Array(slidesCount)].map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor:
                index === currentIndex
                  ? alpha(accentColor, 0.9)
                  : alpha(subtleText, 0.4),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: alpha(accentColor, 0.6),
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ServicesTestimonials;
