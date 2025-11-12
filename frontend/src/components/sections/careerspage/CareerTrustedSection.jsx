import { Box, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const CareerTrustedSection = ({ logos }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          background: isDark
            ? 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(67,56,202,0.6) 100%)'
            : 'linear-gradient(135deg, rgba(224,242,254,0.95) 0%, rgba(191,219,254,0.9) 100%)'
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} textAlign={{ xs: 'left', md: 'center' }}>
            <Typography
              variant="overline"
              sx={{ fontWeight: 700, letterSpacing: 2, color: isDark ? alpha('#fff', 0.8) : 'text.secondary' }}
            >
              Work With Us, Grow With Us
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#fff' : 'text.primary' }}>
              Trusted by teams that ship at scale
            </Typography>
          </Stack>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="center">
            {logos.map((brand) => (
              <Grid key={brand.name} item xs={6} sm={4} md={2}>
                <Box
                  component="img"
                  src={brand.logo}
                  alt={brand.name}
                  sx={{
                    width: '100%',
                    height: 52,
                    objectFit: 'contain',
                    filter: isDark ? 'brightness(0) invert(1)' : 'none',
                    opacity: isDark ? 0.9 : 1
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CareerTrustedSection;
