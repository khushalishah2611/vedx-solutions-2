import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CareerBenefitsSection = ({ benefits = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700 }}
        >
          Why You Will Love Working With Us
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: subtleText, maxWidth: 760, lineHeight: 1.7 }}
        >
          The benefits, culture, and support you need to do your best work.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {benefits.map((benefit) => (
          <Grid item xs={12} sm={6} md={3} key={benefit.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.78 : 0.97
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                boxShadow: isDark
                  ? '0 16px 30px rgba(2,6,23,0.4)'
                  : '0 16px 30px rgba(15,23,42,0.12)',
              }}
            >
              <Stack spacing={2} alignItems="center">
                {benefit.icon && (
                  <Box
                    component="img"
                    src={benefit.icon}
                    alt={benefit.title}
                    sx={{ width: 52, height: 52, objectFit: 'contain' }}
                  />
                )}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                  {benefit.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CareerBenefitsSection.propTypes = {
  benefits: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
};

export default CareerBenefitsSection;
