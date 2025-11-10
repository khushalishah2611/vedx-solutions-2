import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { fullStackBenefits } from '../../../data/servicesPage.js';

const ServicesHighlights = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box component="section" sx={{ position: 'relative' }}>
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Full Stack Development Service
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 760 }}>
          Unlock reliable delivery, transparent communication, and technology choices that support your growth at every stage.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {fullStackBenefits.map(({ title, description, Icon }) => (
          <Grid item xs={12} md={6} key={title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.98),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
                transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                boxShadow: isDark
                  ? '0 24px 45px rgba(15,23,42,0.35)'
                  : '0 24px 45px rgba(15,23,42,0.1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: alpha(accentColor, 0.6),

                }
              }}
            >
              {Icon && (
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(accentColor, 0.16),
                    color: accentColor, "&:hover": {
                      color: isDark ? "#67e8f9" : theme.palette.primary.main,
                    },
                    mb: 2
                  }}
                >
                  <Icon />
                </Box>
              )}

              <Typography variant="h6" sx={{
                fontWeight: 700, "&:hover": {
                  color: isDark ? "#67e8f9" : theme.palette.primary.main,
                },
              }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.7 }}>
                {description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesHighlights;
