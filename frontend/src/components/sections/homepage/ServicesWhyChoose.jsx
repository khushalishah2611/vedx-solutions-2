import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { whyChooseVedx } from '../../../data/servicesPage.js';

const ServicesWhyChoose = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Why choose Vedx Solutions for Full Stack Development Service
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 760 }}>
          We act as an integrated partner who understands your domain, your users, and your growth goals.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {whyChooseVedx.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.98),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
                boxShadow: isDark
                  ? '0 24px 45px rgba(15,23,42,0.35)'
                  : '0 24px 45px rgba(15,23,42,0.1)'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesWhyChoose;
