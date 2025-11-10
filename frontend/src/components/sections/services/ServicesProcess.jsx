import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { processSteps } from '../../../data/servicesPage.js';
import { useEffect, useMemo, useState } from 'react';

const ServicesProcess = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main; // ✅ Added missing accentColor
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const stepsPerView = useMemo(() => {
    if (isLgUp) {
      return 3;
    }

    if (isMdUp) {
      return 2;
    }

    return 1;
  }, [isLgUp, isMdUp]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, processSteps.length - stepsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, stepsPerView]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - stepsPerView, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + stepsPerView, maxIndex));
  };

  const visibleSteps = processSteps.slice(
    currentIndex,
    currentIndex + stepsPerView
  );
  const showNavigation = processSteps.length > stepsPerView;

  return (
    <Box component="section" sx={{ position: 'relative' }}>
      {/* Section Header */}
      <Stack
        spacing={3}
        sx={{
          mb: 4,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
          }}
        >
          Process
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 720,
          }}
        >
          We follow a transparent roadmap—from discovery to deployment—so you always know what is happening next.
        </Typography>
      </Stack>

      {/* Steps Grid */}
      <IconButton
        aria-label="Previous process step"
        onClick={handlePrev}
        disabled={currentIndex === 0}
        sx={{
          position: 'absolute',
          top: { xs: 112, sm: 120 },
          left: { xs: 8, sm: 16 },
          zIndex: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.6)}`,
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.98)
          },
          display: showNavigation ? 'flex' : 'none'
        }}
      >
        <KeyboardArrowLeftRoundedIcon />
      </IconButton>

      <IconButton
        aria-label="Next process step"
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
        sx={{
          position: 'absolute',
          top: { xs: 112, sm: 120 },
          right: { xs: 8, sm: 16 },
          zIndex: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.6)}`,
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.98)
          },
          display: showNavigation ? 'flex' : 'none'
        }}
      >
        <KeyboardArrowRightRoundedIcon />
      </IconButton>

      <Grid container spacing={4} sx={{ overflow: 'hidden' }}>
        {visibleSteps.map((step, index) => (
          <Grid item xs={12} md={6} lg={4} key={step.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
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
                  boxShadow: isDark
                    ? '0 12px 40px rgba(255,255,255,0.12)'
                    : '0 12px 40px rgba(0,0,0,0.12)',
                  borderColor: alpha(accentColor, 0.5),
                },
              }}
            >
              {/* Step Image */}
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  backgroundImage: `url(${step.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Step Number Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    px: 2,
                    py: 0.5,
                    borderRadius: 999,
                    background: alpha(theme.palette.common.black, 0.6),
                    color: theme.palette.common.white,
                    fontWeight: 600,
                    letterSpacing: 1.2,
                  }}
                >
                  {currentIndex + index + 1}
                </Box>
              </Box>

              {/* Step Content */}
              <Stack spacing={1.5} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: subtleText }}>
                  {step.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesProcess;
