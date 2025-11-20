import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
  IconButton
} from '@mui/material';

import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { useRef } from 'react';
import { whyChooseVedx } from '../../../data/servicesPage.js';

const highlightIcons = [
  WorkspacePremiumRoundedIcon,
  VerifiedRoundedIcon,
  AutoAwesomeRoundedIcon
];

const ServicesWhyChoose = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <Box component="section">
      {/* Heading */}
      <Stack spacing={3} sx={{ mb: 4, textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Why choose Vedx Solutions
        </Typography>

        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          A partner obsessed with outcomes, clarity, and dependable delivery. We build every engagement around
          collaboration and trust.
        </Typography>
      </Stack>

      {/* Mobile Arrows */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'relative' }}>
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: 'absolute',
            left: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: alpha('#000', 0.4),
            color: 'white',
            '&:hover': { bgcolor: alpha('#000', 0.6) }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={scrollRight}
          sx={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: alpha('#000', 0.4),
            color: 'white',
            '&:hover': { bgcolor: alpha('#000', 0.6) }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Mobile Scroll */}
      <Box
        ref={scrollRef}
        sx={{
          display: { xs: 'flex', md: 'none' },
          overflowX: 'auto',
          gap: 2,
          scrollBehavior: 'smooth',
          pb: 1,
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {whyChooseVedx.map((highlight, index) => {
          const Icon = highlight.icon ?? highlightIcons[index % highlightIcons.length];

          return (
            <Paper
              key={highlight.title}
              elevation={0}
              sx={{
                minWidth: 280,
                flexShrink: 0,
                borderRadius: 1.5,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.97),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                boxShadow: isDark
                  ? '0 4px 30px rgba(2,6,23,0.35)'
                  : '0 4px 30px rgba(15,23,42,0.15)',
                transition: 'transform 0.45s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  borderColor: accentColor
                }
              }}
            >
              {/* ICON CENTER FIXED */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  margin: '0 auto',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(accentColor, 0.16),
                  color: accentColor,
                  mb: 2
                }}
              >
                {Icon && <Icon sx={{ fontSize: 32 }} />}
              </Box>

              <Stack spacing={1} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    transition: '0.3s',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg,#9c27b0,#2196f3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }
                  }}
                >
                  {highlight.title}
                </Typography>

                <Typography variant="body2" sx={{ color: subtleText }}>
                  {highlight.description}
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Box>

      {/* Desktop Grid */}
      <Grid container spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
        {whyChooseVedx.map((highlight, index) => {
          const Icon = highlight.icon ?? highlightIcons[index % highlightIcons.length];

          return (
            <Grid item xs={12} sm={6} md={4} key={highlight.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 1.5,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.97),
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                  boxShadow: isDark
                    ? '0 4px 30px rgba(2,6,23,0.35)'
                    : '0 4px 30px rgba(15,23,42,0.15)',
                  transition: 'transform .45s ease',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    borderColor: accentColor
                  }
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(accentColor, 0.16),
                    color: accentColor,
                    mb: 2
                  }}
                >
                  {Icon && <Icon sx={{ fontSize: 32 }} />}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    transition: '.3s',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg,#9c27b0,#2196f3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }
                  }}
                >
                  {highlight.title}
                </Typography>

                <Typography variant="body2" sx={{ color: subtleText }}>
                  {highlight.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* CTA Button */}
      <Stack alignItems="center" sx={{ mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowOutwardRoundedIcon />}
          sx={{
            background: 'linear-gradient(90deg,#FF5E5E,#A84DFF)',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            px: { xs: 4, md: 8 },
            py: { xs: 1.5, md: 2 },
            '&:hover': { background: 'linear-gradient(90deg,#FF4C4C,#9939FF)' }
          }}
        >
          Request a Quote
        </Button>
      </Stack>
    </Box>
  );
};

export default ServicesWhyChoose;
