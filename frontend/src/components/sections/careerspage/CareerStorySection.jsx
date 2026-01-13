import { Box, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CareerStorySection = ({ story }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);

  return (
    <Box component="section">
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {story?.badge && (
              <Typography
                variant="overline"
                sx={{ color: alpha(theme.palette.primary.main, 0.9), letterSpacing: 2 }}
              >
                {story.badge}
              </Typography>
            )}
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700 }}
            >
              {story?.title}
            </Typography>
            <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.7 }}>
              {story?.description}
            </Typography>
            <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
              {story?.body}
            </Typography>
            <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
              {story?.culture}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={story?.image}
            alt={story?.title || 'Careers at Vedx Solutions'}
            sx={{
              width: '100%',
              borderRadius: 4,
              boxShadow: isDark
                ? '0 30px 60px rgba(2,6,23,0.45)'
                : '0 30px 60px rgba(15,23,42,0.18)',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

CareerStorySection.propTypes = {
  story: PropTypes.shape({
    badge: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string,
    culture: PropTypes.string,
    image: PropTypes.string,
  }),
};

CareerStorySection.defaultProps = {
  story: null,
};

export default CareerStorySection;
