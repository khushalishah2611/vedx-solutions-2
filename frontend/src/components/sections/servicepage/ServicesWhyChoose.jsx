import { Box, Button, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
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

  return (
    <Box component="section">
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
          sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}
        >
          Why choose Vedx Solutions
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: subtleText, maxWidth: 720 }}
        >
          A partner obsessed with outcomes, clarity, and dependable delivery. We build every engagement around
          collaboration and trust.
        </Typography>
      </Stack>

      {/* Highlights Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          textAlign: 'center',
          alignItems: 'stretch',
        }}
      >
        {whyChooseVedx.map((highlight, index) => {
          const Icon = highlight.icon ?? highlightIcons[index % highlightIcons.length];
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
                  transition:
                    'transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease',

                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',

                    borderColor: alpha(accentColor, 0.5),
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(accentColor, 0.16),
                    color: accentColor,
                    mb: 2,
                  }}
                >
                  {Icon && <Icon />}
                </Box>

                {/* Text */}
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{
                    fontWeight: 700, textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, background-image 0.3s ease',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },

                  }}>
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
      <Stack alignItems="center" sx={{ width: '100%', mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowOutwardRoundedIcon />}
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
        </Button>
      </Stack>
    </Box>
  );
};

export default ServicesWhyChoose;
