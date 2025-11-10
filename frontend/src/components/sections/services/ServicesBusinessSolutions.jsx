import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { businessSolutions } from '../../../data/servicesPage.js';

const ServicesBusinessSolutions = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.6);
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box component="section">
      {/* Header */}
      <Stack
        spacing={3}
        sx={{
          mb: 6,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}
        >
          Tech solutions for all business types
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 720,
          }}
        >
          Whether you are validating an idea or optimising global operations,
          our playbooks adapt to your stage and ambition.
        </Typography>
      </Stack>

      {/* Cards */}
      <Grid container spacing={2}>
        {businessSolutions.map((solution) => (
          <Grid item xs={12} sm={6} md={3} key={solution.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2,
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.7 : 0.95
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                transition: 'all 0.35s ease',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                  boxShadow: isDark
                    ? '0 10px 25px rgba(255,255,255,0.08)'
                    : '0 10px 25px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {solution.title}
                </Typography>

                <Divider sx={{ borderColor: dividerColor }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: subtleText,
                    lineHeight: 1.6,
                  }}
                >
                  {solution.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}

        {/* Centered Button */}
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
            Get Started
          </Button>
        </Stack>
      </Grid>
    </Box>
  );
};

export default ServicesBusinessSolutions;
