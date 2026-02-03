import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { AppButton } from '../../shared/FormControls.jsx';

const CareerOpenRolesSection = ({ roles, applyHref, title, description }) => {
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

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} key={role.title}>
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
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {role.title}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {role.experience}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {role.positions}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {role.type}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                  {role.description}
                </Typography>
                {applyHref && (
                  <Box>
                    <AppButton
                      variant="outlined"
                      href={applyHref}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '10px',
                      }}
                    >
                      Apply Now
                    </AppButton>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CareerOpenRolesSection.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      experience: PropTypes.string,
      positions: PropTypes.string,
      type: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  applyHref: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

CareerOpenRolesSection.defaultProps = {
  roles: [],
  applyHref: null,
  title: 'Open Positions',
  description: 'Explore current opportunities to join our high-impact teams.',
};

export default CareerOpenRolesSection;
