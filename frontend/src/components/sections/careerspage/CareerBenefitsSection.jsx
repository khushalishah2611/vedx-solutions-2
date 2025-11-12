import {

  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const CareerBenefitsSection = ({ benefits = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.75);

  return (
    <Container id="benefits" maxWidth="lg" sx={{ mt: { xs: 10, md: 14 } }}>
      {/* === SECTION HEADER === */}
      <Stack
        spacing={2.5}
        alignItems="center"
        textAlign="center"
        sx={{ mb: { xs: 6, md: 8 } }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 28, md: 36 },
            color: isDark
              ? alpha('#ffffff', 0.95)
              : alpha('#000000', 0.95),
          }}
        >
          Your Journey with Vedx
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 720,
            textAlign: { xs: 'left', md: 'center' },
            color: subtleText,
            lineHeight: 1.7,
            fontSize: { xs: 16, md: 17 },
          }}
        >
          Benefits that keep our teams energized, inspired, and ready to build
          the next generation of digital experiences.
        </Typography>
      </Stack>

      {/* === BENEFITS GRID === */}
      <Grid container spacing={{ xs: 4, md: 5 }}>
        {benefits.map((benefit, index) => {


          return (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 0.5,
                  p: 2,
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
                    boxShadow: isDark
                      ? '0 10px 40px rgba(0,0,0,0.5)'
                      : '0 10px 40px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(accentColor, 0.15),
                    color: accentColor,
                    mb: 2,
                  }}
                >
                  <WorkOutlineIcon sx={{ fontSize: 32 }} />
                </Box>
                {/* Text */}
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      "&:hover": {
                        color: isDark ? "#67e8f9" : theme.palette.primary.main,
                      },
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? alpha('#ffffff', 0.75)
                        : alpha('#000000', 0.75),
                      lineHeight: 1.6,
                      maxWidth: 260,
                      mx: 'auto',
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default CareerBenefitsSection;
