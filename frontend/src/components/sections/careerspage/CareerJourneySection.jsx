import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CareerJourneySection = ({ journey }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box component="section">
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 700 }}
        >
          Hiring Journey
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: subtleText, maxWidth: 720, lineHeight: 1.7 }}
        >
          A transparent process designed to help you showcase your strengths.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {journey.map((step) => (
          <Grid item xs={12} sm={6} md={4} key={step.step}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.78 : 0.97
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                boxShadow: isDark
                  ? '0 16px 30px rgba(2,6,23,0.35)'
                  : '0 16px 30px rgba(15,23,42,0.12)',
              }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="overline"
                  sx={{ color: accentColor, fontSize: 14, fontWeight: 700 }}
                >
                  {step.step}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                  {step.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CareerJourneySection.propTypes = {
  journey: PropTypes.arrayOf(
    PropTypes.shape({
      step: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

CareerJourneySection.defaultProps = {
  journey: [],
};

export default CareerJourneySection;
