import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { Box, Divider, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { megaMenuContent } from '../../../data/content.js';
import { createAnchorHref } from '../../../utils/formatters.js';

const ServicesOverview = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const serviceCategories = megaMenuContent.services.categories;

  return (
    <Box component="section" id="services-overview">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Explore our core expertise
        </Typography>
        <Typography variant="body1" sx={{ color: alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78), maxWidth: 720 }}>
          Seamless cross-functional squads cover product strategy, experience design, engineering, and growth enablement.
          Discover the service lane that matches your next initiative.
        </Typography>
      </Stack>
      <Grid container spacing={4}>
        {serviceCategories.map((category) => {
          const sectionId = createAnchorHref(category.label).replace('#', '');
          const overlayGradient = isDark
            ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 85%)'
            : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 85%)';

          return (
            <Grid item xs={12} sm={6} md={4} key={category.label}>
              <Paper
                component="article"
                id={sectionId}
                elevation={0}
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  minHeight: 360,
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'common.white',
                  backgroundColor: alpha('#0f172a', 0.95),
                  boxShadow: isDark ? '0 28px 60px rgba(2,6,23,0.65)' : '0 28px 60px rgba(15,23,42,0.22)'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scale(1.05)'
                  }}
                />
                <Box sx={{ position: 'absolute', inset: 0, background: overlayGradient }} />
                <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1, p: 3.5, flexGrow: 1 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {category.label}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: alpha('#ffffff', 0.75) }}>
                      {category.description}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: alpha('#ffffff', 0.2) }} />
                  <Stack spacing={1.2}>
                    {category.subItems.map((item) => {
                      const itemAnchor = createAnchorHref(item).replace('#', '');
                      return (
                        <Stack key={item} id={itemAnchor} direction="row" spacing={1.2} alignItems="center">
                          <ArrowOutwardRoundedIcon sx={{ fontSize: 18, color: alpha('#ffffff', 0.75) }} />
                          <Typography component="span" variant="body2" sx={{ color: alpha('#ffffff', 0.85) }}>
                            {item}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ServicesOverview;
