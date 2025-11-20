import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

const CareerJourneySection = ({ journey = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!journey.length) return null;

  const accent = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Container
      id="journey"
    
    >
      {/* Heading */}
      <Stack
        spacing={1.5}
        alignItems="center"
        textAlign="center"
        sx={{
          mb: { xs: 4, md: 6 },
          opacity: 0,
          '@keyframes headingFadeUp': {
            '0%': { opacity: 0, transform: 'translateY(12px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          animation: 'headingFadeUp 600ms ease-out 80ms forwards',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 24, sm: 28, md: 32 },
          }}
        >
          Hiring Process
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 520,
            color: alpha(theme.palette.text.secondary, 0.85),
            fontSize: { xs: 13, sm: 14 },
          }}
        >
          Follow our step-by-step journey from application to joining the team.
        </Typography>
      </Stack>

      {/* Timeline Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: 0.5,
          border: `1px solid ${alpha(accent, isDark ? 0.5 : 0.3)}`,
          bgcolor: isDark ? alpha('#020617', 0.8) : '#ffffff',

          // KEYFRAMES for step animation (no external libs)
          '@keyframes stepFadeUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(18px) scale(0.98)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
        }}
      >
        <Grid
          container
          rowSpacing={{ xs: 4, md: 0 }}
          columnSpacing={{ md: 4 }}
          justifyContent="center"
        >
          {journey.map((step, index) => {
            const isLast = index === journey.length - 1;

            // stagger delay: each step 140ms after previous
            const delayMs = 150 + index * 140;

            return (
              <Grid
                key={step.step ?? index}
                item
                xs={12}
                md={2} // 5 steps layout; adjust if your count changes
              >
                <Stack
                  spacing={1.5}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  textAlign={{ xs: 'left', md: 'center' }}
                  sx={{
                    position: 'relative',
                    pb: { xs: isLast ? 0 : 3, md: 0 },

                    // start hidden, then animate in
                    opacity: 0,
                    animation: `stepFadeUp 650ms ease-out ${delayMs}ms forwards`,

                    // Horizontal line (desktop)
                    '&::after': {
                      content: '""',
                      display: { xs: 'none', md: isLast ? 'none' : 'block' },
                      position: 'absolute',
                      top: 28,
                      left: `calc(50% + ${theme.spacing(4)})`,
                      width: `calc(100% + ${theme.spacing(4)})`,
                      height: 2,
                      bgcolor: alpha(accent, isDark ? 0.35 : 0.18),
                    },

                    // Vertical line (mobile)
                    '&::before': {
                      content: '""',
                      display: { xs: index === 0 ? 'none' : 'block', md: 'none' },
                      position: 'absolute',
                      left: 28,
                      top: -24,
                      width: 2,
                      height: 24,
                      bgcolor: alpha(accent, isDark ? 0.35 : 0.25),
                    },
                  }}
                >
                  {/* Step Badge */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 18,
                      bgcolor: alpha(accent, isDark ? 0.2 : 0.1),
                      color: accent,
                      boxShadow: `0 10px 30px ${alpha(
                        accent,
                        isDark ? 0.3 : 0.18
                      )}`,
                      flexShrink: 0,
                    }}
                  >
                    {step.step}
                  </Box>

                  {/* Title + Optional description */}
                  <Stack spacing={0.5}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: 14, sm: 15, md: 16 },
                      }}
                    >
                      {step.title}
                    </Typography>

                    {step.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha(theme.palette.text.secondary, 0.9),
                          fontSize: { xs: 12.5, sm: 13, md: 13.5 },
                          lineHeight: 1.6,
                        }}
                      >
                        {step.description}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CareerJourneySection;
