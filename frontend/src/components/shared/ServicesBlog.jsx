import { Box, Chip, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { blogPreviews } from '../../data/servicesPage.js';

const ServicesBlog = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Latest blogs
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {blogPreviews.map((post) => (
          <Grid item xs={12} md={4} key={post.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',

                textAlign: 'left',
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.97
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                transition:
                  'transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease',
                boxShadow: isDark
                  ? '0 4px 30px rgba(2,6,23,0.35)'
                  : '0 4px 30px rgba(15,23,42,0.15)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: isDark
                    ? '0 12px 40px rgba(255,255,255,0.12)'
                    : '0 12px 40px rgba(0,0,0,0.12)',
                  borderColor: alpha(accentColor, 0.5)
                }
              }}
            >
              <Box
                sx={{
                  height: 250,
                  borderRadius: 0.5,
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />

              <Stack spacing={1.5} sx={{ p: 3, flexGrow: 1 }}>
                <Chip
                  label={post.category}
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: alpha(accentColor, 0.15),
                    color: accentColor,
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: theme.palette.text.primary,
                  }}
                >
                  {post.title}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesBlog;
