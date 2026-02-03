import { Box, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CareerJourneySection = ({
  journey = [],
  title = 'Hiring Journey',
  description = 'A transparent process designed to help you showcase your strengths.',
}) => {
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
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: subtleText, maxWidth: 720, lineHeight: 1.7 }}
        >
          {description}
        </Typography>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          backgroundColor: alpha(
            theme.palette.background.paper,
            isDark ? 0.78 : 0.97
          ),
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
          boxShadow: isDark
            ? '0 18px 36px rgba(2,6,23,0.35)'
            : '0 18px 36px rgba(15,23,42,0.12)',
          overflowX: { xs: 'auto', md: 'visible' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: { xs: 32, md: 48 },
            right: { xs: 32, md: 48 },
            top: { xs: 72, md: 78 },
            height: 2,
            backgroundColor: alpha(accentColor, 0.55),
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{ minWidth: { xs: 720, md: 'auto' }, position: 'relative' }}
        >
          {journey.map((step) => (
            <Stack
              key={step.step}
              spacing={1.5}
              alignItems="center"
              textAlign="center"
              sx={{ width: { xs: 120, md: 'auto' } }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {step.title}
              </Typography>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `3px solid ${accentColor}`,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: `0 0 0 6px ${alpha(accentColor, 0.15)}`,
                }}
              />
              <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                {step.description}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
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
  title: PropTypes.string,
  description: PropTypes.string,
};

export default CareerJourneySection;
