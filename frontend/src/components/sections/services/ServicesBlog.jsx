import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Box, Chip, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { blogPreviews } from '../../../data/servicesPage.js';

const ServicesBlog = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Latest blogs
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          Insights from our engineering, product, and growth teams to help you stay ahead.
        </Typography>
      </Stack>
      <Grid container spacing={4}>
        {blogPreviews.map((post) => (
          <Grid item xs={12} md={4} key={post.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.97),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
              }}
            >
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <Stack spacing={1.5} sx={{ p: 3, flexGrow: 1 }}>
                <Chip
                  label={post.category}
                  sx={{ alignSelf: 'flex-start', bgcolor: alpha(accentColor, 0.15), color: accentColor, fontWeight: 600 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {post.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 18, color: accentColor }} />
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    5 min read
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesBlog;
