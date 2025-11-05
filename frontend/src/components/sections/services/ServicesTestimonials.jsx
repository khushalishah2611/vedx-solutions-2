import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { testimonialList } from '../../../data/servicesPage.js';

const ServicesTestimonials = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          What people are saying
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          Teams trust Vedx Solutions for transparent communication and consistent delivery.
        </Typography>
      </Stack>
      <Grid container spacing={4}>
        {testimonialList.map((testimonial) => (
          <Grid item xs={12} md={6} key={testimonial.name}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.96),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                boxShadow: isDark ? '0 30px 60px rgba(2,6,23,0.45)' : '0 30px 60px rgba(15,23,42,0.18)'
              }}
            >
              <FormatQuoteRoundedIcon sx={{ fontSize: 48, color: alpha(accentColor, 0.8) }} />
              <Typography variant="body1" sx={{ color: subtleText, fontStyle: 'italic' }}>
                {testimonial.quote}
              </Typography>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" sx={{ color: subtleText }}>
                  {testimonial.role}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesTestimonials;
