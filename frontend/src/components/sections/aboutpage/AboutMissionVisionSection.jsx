import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const AboutMissionVisionSection = ({ content }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);
  const cards = [content?.mission, content?.vision].filter(Boolean);

  return (
    <Box component="section">
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700 }}
        >
          Mission & Vision
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: subtleText, maxWidth: 720, lineHeight: 1.7 }}
        >
          Guiding principles that shape how we partner with teams and design
          meaningful digital outcomes.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {cards.map((item) => (
          <Grid item xs={12} md={6} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
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
                  ? '0 16px 30px rgba(2,6,23,0.4)'
                  : '0 16px 30px rgba(15,23,42,0.12)',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

AboutMissionVisionSection.propTypes = {
  content: PropTypes.shape({
    mission: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    vision: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
};

AboutMissionVisionSection.defaultProps = {
  content: null,
};

export default AboutMissionVisionSection;
