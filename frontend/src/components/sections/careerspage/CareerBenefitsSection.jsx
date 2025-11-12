import { Avatar, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const CareerBenefitsSection = ({ benefits }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container id="benefits" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700 }}>
          Why Join Vedx?
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Benefits that keep our teams energised
        </Typography>
      </Stack>
      <Grid container spacing={{ xs: 4, md: 5 }}>
        {benefits.map((benefit) => (
          <Grid key={benefit.title} item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: { xs: 4, md: 4 },
                borderRadius: 5,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                bgcolor: alpha(theme.palette.background.paper, isDark ? 0.35 : 0.65),
                border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)}`
              }}
            >
              <Avatar
                src={benefit.icon}
                alt={benefit.title}
                variant="rounded"
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  borderRadius: 18
                }}
              />
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {benefit.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CareerBenefitsSection;
