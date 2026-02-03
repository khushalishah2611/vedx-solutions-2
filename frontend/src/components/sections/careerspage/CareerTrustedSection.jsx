import { Box, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CareerTrustedSection = ({ logos, title, description }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);

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

      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {logos.map((logo) => (
          <Grid item xs={6} sm={4} md={3} key={logo.name}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 1.5,
                filter: isDark ? 'grayscale(0%)' : 'grayscale(15%)',
                opacity: 0.9,
              }}
            >
              <Box
                component="img"
                src={logo.logo}
                alt={logo.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 48,
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CareerTrustedSection.propTypes = {
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      logo: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  description: PropTypes.string,
};

CareerTrustedSection.defaultProps = {
  logos: [],
  title: 'Trusted Technology Partners',
  description: 'We collaborate with platforms and tools our teams love working with.',
};

export default CareerTrustedSection;
