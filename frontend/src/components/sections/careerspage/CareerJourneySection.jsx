import { Box, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const CareerJourneySection = ({ journey }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container id="journey" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Hiring Process
        </Typography>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 0.5,
          border: `1px solid ${alpha(isDark ? "#67e8f9" : theme.palette.primary.main, isDark ? 0.5 : 0.3)}`
        }}
      >
        <Grid container spacing={{ xs: 5, md: 0 }} columnSpacing={{ md: 4 }} justifyContent="center">
          {journey.map((step, index) => {
            const isLast = index === journey.length - 1;

            return (
              <Grid key={step.step} item xs={12} md={2}>
                <Stack
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  textAlign={{ xs: 'left', md: 'center' }}
                  sx={{
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      display: { xs: 'none', md: isLast ? 'none' : 'block' },
                      position: 'absolute',
                      top: 24,
                      left: `calc(50% + ${theme.spacing(4)})`,
                      width: `calc(100% + ${theme.spacing(4)})`,
                      height: 2,
                      bgcolor: alpha(isDark ? "#67e8f9" : theme.palette.primary.main, isDark ? 0.35 : 0.18)
                    }
                  }}
                >
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
                      bgcolor: alpha(isDark ? "#67e8f9" : theme.palette.primary.main, isDark ? 0.2 : 0.12),
                      color: isDark ? "#67e8f9" : theme.palette.primary.main,
                      boxShadow: `0 10px 30px ${alpha(isDark ? "#67e8f9" : theme.palette.primary.main, isDark ? 0.3 : 0.2)}`
                    }}
                  >
                    {step.step}
                  </Box>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {step.title}
                    </Typography>

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
